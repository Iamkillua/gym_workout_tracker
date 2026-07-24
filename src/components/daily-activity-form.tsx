import { FootprintsIcon, FlameIcon } from "lucide-react"

import { saveDailyActivityAction } from "@/app/actions/daily-activity"
import { SubmitButton } from "@/components/submit-button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function DailyActivityForm({
  steps,
  activityCalories,
}: {
  steps: number
  activityCalories: number
}) {
  return (
    <form action={saveDailyActivityAction}>
      <FieldGroup>
        <FieldGroup className="grid grid-cols-2">
          <Field>
            <FieldLabel htmlFor="steps">
              <FootprintsIcon />
              Steps
            </FieldLabel>
            <Input
              id="steps"
              name="steps"
              type="number"
              inputMode="numeric"
              min={0}
              max={200000}
              defaultValue={steps}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="activityCalories">
              <FlameIcon />
              Activity calories
            </FieldLabel>
            <Input
              id="activityCalories"
              name="activityCalories"
              type="number"
              inputMode="numeric"
              min={0}
              max={20000}
              defaultValue={activityCalories}
              required
            />
          </Field>
        </FieldGroup>
        <Field>
          <FieldDescription>
            Saving again today replaces today&apos;s values. Tomorrow starts at zero.
          </FieldDescription>
          <SubmitButton pendingLabel="Updating activity...">
            Update today
          </SubmitButton>
        </Field>
      </FieldGroup>
    </form>
  )
}