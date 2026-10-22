using UnrealBuildTool;

public class CinderDistrictPrototypeEditorTarget : TargetRules
{
    public CinderDistrictPrototypeEditorTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V2;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_2;
        ExtraModuleNames.Add("CinderDistrictPrototype");
    }
}
