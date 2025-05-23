import { invalidateCache, uploadStaticFile } from '@basemaps/cli-config/build/util.js';
import { fsa } from '@basemaps/shared';
import { CliId, CliInfo } from '@basemaps/shared/build/cli/info.js';
import { LogConfig } from '@basemaps/shared/build/log.js';
import mime from 'mime-types';
import pLimit from 'p-limit';
import { basename, extname } from 'path';

const Q = pLimit(10);

const DistDir = fsa.toUrl('./dist/');

const ignoredFiles = new Set(['.DS_Store']);

// match a string containing a version number
const HasVersionRe = /-\d+\.\d+\.\d+-/;

/**
 * Determine the top level folder or file name to invalidate
 *
 * @example
 *
 * ```typescript
 * getInvalidationPath("docs/index.html") // "/docs*"
 * getInvalidationPath("docs/example/index.html") // "/docs*"
 * getInvalidationPath("index.html") // "index.html"
 * ```
 *
 * @param {string} targetKey
 * @returns string
 */
export function getInvalidationPath(targetKey) {
  if (!targetKey.startsWith('/')) targetKey = '/' + targetKey;
  if (targetKey.includes('/', 1)) {
    // Convert /docs/a/index.html => "/docs*"
    const dirName = targetKey.split('/').at(1);
    return `/${dirName}*`;
  }

  return targetKey;
}

/**
 * Deploy the built s3 assets into the Edge bucket
 */
async function deploy() {
  const logger = LogConfig.get().child({ id: CliId });
  logger.info({ package: CliInfo }, 'Deploy:Start');
  LogConfig.set(logger);

  const invalidationPaths = new Set();

  const fileList = await fsa.toArray(fsa.list(DistDir));
  const promises = fileList.map((filePath) => {
    // Ignore the files that don't need to be deployed.
    if (ignoredFiles.has(basename(filePath.pathname))) return;
    // targetKey will always start with "/" eg: "/index.html" "/docs/index.html"
    const targetKey = filePath.href.slice(DistDir.href.length);

    return Q(async () => {
      const isVersioned = HasVersionRe.test(basename(filePath.pathname));
      const contentType = mime.contentType(extname(filePath.pathname));

      if (contentType === false) {
        throw new Error('Could not determine content type');
      }

      const cacheControl = isVersioned
        ? // Set cache control for versioned files to immutable
          'public, max-age=604800, immutable'
        : // Set cache control for non versioned files to be short lived
          'public, max-age=60, stale-while-revalidate=300';

      if (targetKey.endsWith('index.html') && targetKey !== '/index.html') {
        await uploadStaticFile(filePath, targetKey.replace('/index.html', ''), contentType, cacheControl);
        await uploadStaticFile(filePath, targetKey.replace('/index.html', '/'), contentType, cacheControl);
      }

      const isUploaded = await uploadStaticFile(filePath, targetKey, contentType, cacheControl);
      if (!isUploaded) return; // No need to invalidate objects not uploaded
      logger.info({ targetKey, isVersioned }, 'Deploy:Upload');
      if (isVersioned) return; // No need to invalidate versioned objects

      // Invalidate the top level directory only
      invalidationPaths.add(getInvalidationPath(targetKey));
    }).catch((e) => {
      logger.error({ targetKey, error: String(e) }, 'Deploy:Failed');
      throw e;
    });
  });

  await Promise.all(promises);

  if (invalidationPaths.size > 0) {
    const toInvalidate = [...invalidationPaths];

    // Only 15 wild cards can be used in a invalidation
    const wildCardCount = toInvalidate.filter((f) => f.includes('*')).length;
    if (wildCardCount > 14) {
      logger.warn({ toInvalidate }, 'InvalidEverything');
      await invalidateCache('/*', true);
    } else {
      logger.info({ toInvalidate }, 'Invalidate');
      await invalidateCache(toInvalidate, true);
    }
  }
}

deploy().catch((e) => {
  console.log(e);
  process.exit(1);
});
