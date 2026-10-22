#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Pawn.h"
#include "Camera/CameraComponent.h"
#include "GameFramework/SpringArmComponent.h"
#include "CinderVehiclePawn.generated.h"

UCLASS()
class CINDERDISTRICTPROTOTYPE_API ACinderVehiclePawn : public APawn
{
    GENERATED_BODY()

public:
    ACinderVehiclePawn();

    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;
    virtual void SetupPlayerInputComponent(class UInputComponent* PlayerInputComponent) override;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    TObjectPtr<USpringArmComponent> SpringArm;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    TObjectPtr<UCameraComponent> VehicleCamera;

    UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = "Components")
    TObjectPtr<UStaticMeshComponent> BodyMesh;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Driving")
    float MaxSpeed = 1200.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Driving")
    float Acceleration = 700.0f;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Driving")
    float Steering = 35.0f;

protected:
    void Throttle(float Value);
    void Steer(float Value);
    void Brake();

    float ForwardInput = 0.0f;
    float SteeringInput = 0.0f;
    float CurrentSpeed = 0.0f;
};
