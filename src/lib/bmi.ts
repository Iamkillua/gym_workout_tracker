export function calculateBmi(weightKg: number, heightCm: number) {
  if (weightKg <= 0 || heightCm <= 0) {
    return 0
  }

  const heightMetres = heightCm / 100
  return Math.round((weightKg / heightMetres ** 2) * 10) / 10
}

export function getBmiLabel(bmi: number) {
  if (bmi < 18.5) return "Below reference range"
  if (bmi < 25) return "Within reference range"
  if (bmi < 30) return "Above reference range"
  return "Well above reference range"
}