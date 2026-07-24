"use client"

import {
  ActivityIcon,
  BikeIcon,
  DumbbellIcon,
  FootprintsIcon,
  PersonStandingIcon,
} from "lucide-react"
import { useActionState, useState } from "react"

import {
  saveWorkoutAction,
  type WorkoutFormState,
} from "@/app/actions/workouts"
import { SubmitButton } from "@/components/submit-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { WorkoutType } from "@/db/schema"
import { calculateAverageSpeed } from "@/lib/workouts"

type WorkoutCategory = "STRENGTH" | "BODYWEIGHT" | "CARDIO"

const initialState: WorkoutFormState = { error: null }

export function WorkoutForm() {
  const [state, formAction] = useActionState(saveWorkoutAction, initialState)
  const [category, setCategory] = useState<WorkoutCategory>("STRENGTH")
  const [cardioType, setCardioType] = useState<"TREADMILL" | "CYCLING">(
    "TREADMILL"
  )
  const [durationMinutes, setDurationMinutes] = useState("")
  const [distanceKm, setDistanceKm] = useState("")
  const type: WorkoutType = category === "CARDIO" ? cardioType : category
  const speed =
    Number(durationMinutes) > 0 && Number(distanceKm) > 0
      ? calculateAverageSpeed(Number(distanceKm), Number(durationMinutes))
      : 0
  const today = new Date().toISOString().slice(0, 10)

  return (
    <form action={formAction}>
      <input type="hidden" name="type" value={type} />
      <FieldGroup>
        {state.error ? (
          <Alert variant="destructive">
            <AlertTitle>Check this workout</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        ) : null}

        <FieldSet>
          <FieldLegend>Workout type</FieldLegend>
          <ToggleGroup
            value={[category]}
            onValueChange={(value) => {
              const selection = value[0] as WorkoutCategory | undefined
              if (selection) setCategory(selection)
            }}
            variant="outline"
            className="grid w-full grid-cols-3"
          >
            <ToggleGroupItem
              value="STRENGTH"
              aria-label="Weight machines or dumbbells"
              className="h-20 min-w-0 flex-col"
            >
              <DumbbellIcon />
              <span>Weights</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="BODYWEIGHT"
              aria-label="Bodyweight workout"
              className="h-20 min-w-0 flex-col"
            >
              <PersonStandingIcon />
              <span>Bodyweight</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="CARDIO"
              aria-label="Cardio workout"
              className="h-20 min-w-0 flex-col"
            >
              <ActivityIcon />
              <span>Cardio</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </FieldSet>

        {category === "CARDIO" ? (
          <FieldSet>
            <FieldLegend>Cardio equipment</FieldLegend>
            <ToggleGroup
              value={[cardioType]}
              onValueChange={(value) => {
                const selection = value[0] as
                  | "TREADMILL"
                  | "CYCLING"
                  | undefined
                if (selection) setCardioType(selection)
              }}
              variant="outline"
              className="grid w-full grid-cols-2"
            >
              <ToggleGroupItem value="TREADMILL">
                <FootprintsIcon data-icon="inline-start" />
                Treadmill
              </ToggleGroupItem>
              <ToggleGroupItem value="CYCLING">
                <BikeIcon data-icon="inline-start" />
                Cycling
              </ToggleGroupItem>
            </ToggleGroup>
          </FieldSet>
        ) : null}

        <FieldSet>
          <FieldLegend>Session details</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Workout name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder={
                  type === "STRENGTH"
                    ? "Bench press"
                    : type === "BODYWEIGHT"
                      ? "Push-ups"
                      : type === "TREADMILL"
                        ? "Morning treadmill"
                        : "Outdoor ride"
                }
                minLength={2}
                maxLength={80}
                required
              />
              <FieldDescription>
                Reuse the same name later to compare progress.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="performedOn">Workout date</FieldLabel>
              <Input
                id="performedOn"
                name="performedOn"
                type="date"
                defaultValue={today}
                max={today}
                required
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        {type === "STRENGTH" ? (
          <FieldSet>
            <FieldLegend>Load and volume</FieldLegend>
            <FieldGroup className="grid grid-cols-3">
              <Field>
                <FieldLabel htmlFor="weightKg">Weight (kg)</FieldLabel>
                <Input
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  inputMode="decimal"
                  min="0.1"
                  max="1000"
                  step="0.1"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="reps">Reps</FieldLabel>
                <Input
                  id="reps"
                  name="reps"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="sets">Sets</FieldLabel>
                <Input
                  id="sets"
                  name="sets"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        ) : null}

        {type === "BODYWEIGHT" ? (
          <FieldSet>
            <FieldLegend>Volume</FieldLegend>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="bodyweightReps">Reps</FieldLabel>
                <Input
                  id="bodyweightReps"
                  name="reps"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="bodyweightSets">Sets</FieldLabel>
                <Input
                  id="bodyweightSets"
                  name="sets"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>
        ) : null}

        {type === "TREADMILL" || type === "CYCLING" ? (
          <FieldSet>
            <FieldLegend>
              {type === "TREADMILL" ? "Treadmill metrics" : "Cycling metrics"}
            </FieldLegend>
            <FieldGroup className="grid grid-cols-2">
              <Field>
                <FieldLabel htmlFor="durationMinutes">Time (min)</FieldLabel>
                <Input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  inputMode="decimal"
                  min="0.1"
                  max="1440"
                  step="0.1"
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(event.target.value)}
                  required
                />
              </Field>
              {type === "TREADMILL" ? (
                <Field>
                  <FieldLabel htmlFor="steps">Steps</FieldLabel>
                  <Input
                    id="steps"
                    name="steps"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    required
                  />
                </Field>
              ) : null}
              <Field>
                <FieldLabel htmlFor="calories">Calories</FieldLabel>
                <Input
                  id="calories"
                  name="calories"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="distanceKm">Distance (km)</FieldLabel>
                <Input
                  id="distanceKm"
                  name="distanceKm"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  max="1000"
                  step="0.01"
                  value={distanceKm}
                  onChange={(event) => setDistanceKm(event.target.value)}
                  required
                />
              </Field>
            </FieldGroup>
            {speed ? (
              <Alert>
                <ActivityIcon />
                <AlertTitle>Average speed: {speed.toFixed(2)} km/h</AlertTitle>
                <AlertDescription>
                  Calculated from distance divided by time.
                </AlertDescription>
              </Alert>
            ) : null}
          </FieldSet>
        ) : null}

        <SubmitButton pendingLabel="Adding workout...">
          Add workout
        </SubmitButton>
      </FieldGroup>
    </form>
  )
}