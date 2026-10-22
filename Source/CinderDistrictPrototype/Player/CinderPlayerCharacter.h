#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "CinderPlayerCharacter.generated.h"

UCLASS()
class CINDERDISTRICTPROTOTYPE_API ACinderPlayerCharacter : public ACharacter
{
    GENERATED_BODY()

public:
    ACinderPlayerCharacter();

    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
    virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement")
    float WalkSpeed = 350.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement")
    float SprintSpeed = 650.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Movement")
    float JumpVelocity = 600.0f;

protected:
    void MoveForward(float Value);
    void MoveRight(float Value);
    void TurnAtRate(float Rate);
    void LookUpAtRate(float Rate);
    void StartSprint();
    void StopSprint();
};
