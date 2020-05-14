import { CommandLineAction, CommandLineStringParameter, CommandLineIntegerParameter } from '@rushstack/ts-command-line';

export abstract class TileSetBaseAction extends CommandLineAction {
    tileSet: CommandLineStringParameter;
    projection: CommandLineIntegerParameter;

    protected onDefineParameters(): void {
        this.tileSet = this.defineStringParameter({
            argumentName: 'TILE_SET',
            parameterLongName: '--tileset-name',
            parameterShortName: '-n',
            description: 'Tileset name to use',
            required: false,
        });

        this.projection = this.defineIntegerParameter({
            argumentName: 'PROJECTION',
            parameterLongName: '--projection',
            parameterShortName: '-p',
            description: 'Projection to use',
            required: false,
        });
    }
}
