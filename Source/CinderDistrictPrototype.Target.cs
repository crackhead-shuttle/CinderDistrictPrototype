using UnrealBuildTool;

public class CinderDistrictPrototypeTarget : TargetRules
{
    public CinderDistrictPrototypeTarget(TargetInfo Target) : base(Target)
    {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V2;
        IncludeOrderVersion = EngineIncludeOrderVersion.Unreal5_2;
        ExtraModuleNames.Add("CinderDistrictPrototype");
    }
}
