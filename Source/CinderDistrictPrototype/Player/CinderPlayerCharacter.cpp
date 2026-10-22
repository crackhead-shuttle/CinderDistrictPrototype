#include "Player/CinderPlayerCharacter.h"

#include "Camera/CameraComponent.h"
#include "Components/CapsuleComponent.h"
#include "GameFramework/CharacterMovementComponent.h"

ACinderPlayerCharacter::ACinderPlayerCharacter()
{
    PrimaryActorTick.bCanEverTick = true;

    GetCapsuleComponent()->InitCapsuleSize(42.0f, 96.0f);

    bUseControllerRotationYaw = false;
    bUseControllerRotationPitch = false;
    bUseControllerRotationRoll = false;

    if (GetCharacterMovement())
    {
        GetCharacterMovement()->bOrientRotationToMovement = true;
        GetCharacterMovement()->RotationRate = FRotator(0.0f, 540.0f, 0.0f);
        GetCharacterMovement()->JumpZVelocity = JumpVelocity;
        GetCharacterMovement()->MaxWalkSpeed = WalkSpeed;
    }
}

void ACinderPlayerCharacter::BeginPlay()
{
    Super::BeginPlay();
}

void ACinderPlayerCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
}

void ACinderPlayerCharacter::SetupPlayerInputComponent(UInputComponent* PlayerInputComponent)
{
    Super::SetupPlayerInputComponent(PlayerInputComponent);

    PlayerInputComponent->BindAxis("MoveForward", this, &ACinderPlayerCharacter::MoveForward);
    PlayerInputComponent->BindAxis("MoveRight", this, &ACinderPlayerCharacter::MoveRight);
    PlayerInputComponent->BindAxis("Turn", this, &ACinderPlayerCharacter::TurnAtRate);
    PlayerInputComponent->BindAxis("LookUp", this, &ACinderPlayerCharacter::LookUpAtRate);
    PlayerInputComponent->BindAction("Jump", IE_Pressed, this, &ACharacter::Jump);
    PlayerInputComponent->BindAction("Sprint", IE_Pressed, this, &ACinderPlayerCharacter::StartSprint);
    PlayerInputComponent->BindAction("Sprint", IE_Released, this, &ACinderPlayerCharacter::StopSprint);
}

void ACinderPlayerCharacter::MoveForward(float Value)
{
    if ((Controller != nullptr) && (Value != 0.0f))
    {
        const FRotator Rotation = Controller->GetControlRotation();
        const FRotator YawRotation(0.0f, Rotation.Yaw, 0.0f);
        const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::X);
        AddMovementInput(Direction, Value);
    }
}

void ACinderPlayerCharacter::MoveRight(float Value)
{
    if ((Controller != nullptr) && (Value != 0.0f))
    {
        const FRotator Rotation = Controller->GetControlRotation();
        const FRotator YawRotation(0.0f, Rotation.Yaw, 0.0f);
        const FVector Direction = FRotationMatrix(YawRotation).GetUnitAxis(EAxis::Y);
        AddMovementInput(Direction, Value);
    }
}

void ACinderPlayerCharacter::TurnAtRate(float Rate)
{
    AddControllerYawInput(Rate);
}

void ACinderPlayerCharacter::LookUpAtRate(float Rate)
{
    AddControllerPitchInput(Rate);
}

void ACinderPlayerCharacter::StartSprint()
{
    if (GetCharacterMovement())
    {
        GetCharacterMovement()->MaxWalkSpeed = SprintSpeed;
    }
}

void ACinderPlayerCharacter::StopSprint()
{
    if (GetCharacterMovement())
    {
        GetCharacterMovement()->MaxWalkSpeed = WalkSpeed;
    }
}
