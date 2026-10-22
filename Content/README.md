#include "Vehicle/CinderVehiclePawn.h"

#include "Components/StaticMeshComponent.h"
#include "GameFramework/Pawn.h"

ACinderVehiclePawn::ACinderVehiclePawn()
{
    PrimaryActorTick.bCanEverTick = true;

    RootComponent = CreateDefaultSubobject<USceneComponent>(TEXT("Root"));

    BodyMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("BodyMesh"));
    BodyMesh->SetupAttachment(RootComponent);
    BodyMesh->SetSimulatePhysics(false);

    SpringArm = CreateDefaultSubobject<USpringArmComponent>(TEXT("SpringArm"));
    SpringArm->SetupAttachment(RootComponent);
    SpringArm->TargetArmLength = 450.0f;
    SpringArm->bUsePawnControlRotation = true;

    VehicleCamera = CreateDefaultSubobject<UCameraComponent>(TEXT("VehicleCamera"));
    VehicleCamera->SetupAttachment(SpringArm, USpringArmComponent::SocketName);
}

void ACinderVehiclePawn::BeginPlay()
{
    Super::BeginPlay();
}

void ACinderVehiclePawn::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);

    const float SpeedFactor = FMath::Clamp(CurrentSpeed / MaxSpeed, -1.0f, 1.0f);
    AddActorLocalOffset(FVector(ForwardInput * Acceleration * DeltaTime, 0.0f, 0.0f), true);
    AddActorLocalRotation(FRotator(0.0f, SteeringInput * Steering * DeltaTime, 0.0f));

    CurrentSpeed = FMath::Clamp(CurrentSpeed + (ForwardInput * Acceleration * DeltaTime), -MaxSpeed * 0.5f, MaxSpeed);
    CurrentSpeed *= 0.985f;
    SetActorRotation(FRotator(0.0f, GetActorRotation().Yaw + SteeringInput * Steering * DeltaTime, 0.0f));
}

void ACinderVehiclePawn::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    PlayerInputComponent->BindAxis("MoveForward", this, &ACinderVehiclePawn::Throttle);
    PlayerInputComponent->BindAxis("MoveRight", this, &ACinderVehiclePawn::Steer);
    PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &ACinderVehiclePawn::Brake);
}

void ACinderVehiclePawn::Throttle(float Value)
{
    ForwardInput = Value;
}

void ACinderVehiclePawn::Steer(float Value)
{
    SteeringInput = Value;
}

void ACinderVehiclePawn::Brake()
{
    CurrentSpeed *= 0.5f;
    ForwardInput = 0.0f;
}
