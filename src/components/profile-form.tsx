"use client"

import { ActivityIcon } from "lucide-react"
import { useState } from "react"

import { saveProfileAction } from "@/app/actions/profile"
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
import { calculateBmi, getBmiLabel } from "@/lib/bmi"

type ProfileFormProps = {
  initialAge?: number
  initialHeightCm?: number
  initialWeightKg?: number
  initialDate: string
  isOnboarding?: boolean
}

export function ProfileForm({
  initialAge,
  initialHeightCm,
  initialWeightKg,
  initialDate,
  isOnboarding = false,
}: ProfileFormProps) {
  const [heightCm, setHeightCm] = useState(
    initialHeightCm ? String(initialHeightCm) : ""
  )
  const [weightKg, setWeightKg] = useState(
    initialWeightKg ? String(initialWeightKg) : ""
  )
  const bmi = calculateBmi(Number(weightKg), Number(heightCm))

  return (
    <form action={saveProfileAction}>
      <input
        type="hidden"
        name="returnTo"
        value={isOnboarding ? "onboarding" : "progress"}
      />
      <FieldSet>
        <FieldLegend>Body details</FieldLegend>
        <FieldDescription>
          Each save creates a dated point in your progress history.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="recordedOn">Measurement date</FieldLabel>
            <Input
              id="recordedOn"
              name="recordedOn"
              type="date"
              defaultValue={initialDate}
              required
            />
          </Field>
          <FieldGroup className="grid grid-cols-2">
            <Field>
              <FieldLabel htmlFor="age">Age</FieldLabel>
              <Input
                id="age"
                name="age"
                type="number"
                inputMode="numeric"
                min={13}
                max={120}
                defaultValue={initialAge}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="heightCm">Height (cm)</FieldLabel>
              <Input
                id="heightCm"
                name="heightCm"
                type="number"
                inputMode="decimal"
                min={100}
                max={250}
                step="0.1"
                value={heightCm}
                onChange={(event) => setHeightCm(event.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel htmlFor="weightKg">Weight (kg)</FieldLabel>
            <Input
              id="weightKg"
              name="weightKg"
              type="number"
              inputMode="decimal"
              min={25}
              max={400}
              step="0.1"
              value={weightKg}
              onChange={(event) => setWeightKg(event.target.value)}
              required
            />
          </Field>
          {bmi ? (
            <Alert>
              <ActivityIcon />
              <AlertTitle>Estimated BMI: {bmi.toFixed(1)}</AlertTitle>
              <AlertDescription>{getBmiLabel(bmi)}</AlertDescription>
            </Alert>
          ) : null}
          <SubmitButton pendingLabel="Saving measurement...">
            {isOnboarding ? "Start tracking" : "Save new measurement"}
          </SubmitButton>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}