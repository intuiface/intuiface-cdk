// Shared type definitions for the CLI

export type BuildType = 'interface-asset' | 'binding-converter';

export interface WorkspaceItem
{
    name: string;
    type: BuildType;
    entry: string;
    category?: string;
    icon?: string;
}

export interface WorkspaceConfig
{
    version: 1;
    name: string;
    items: WorkspaceItem[];
}

export interface BuildTarget
{
    name: string;
    buildType: BuildType;
    entryFile: string;
    outputDir: string;
    icon?: string;
    category?: string;
    useGeneratedWebpackConfig: boolean;
}

export interface InitItemOptions
{
    type: BuildType;
    name: string;
    category: string;
    icon?: string;
}

export interface ExecResult
{
    stdout: string;
    stderr: string;
}
