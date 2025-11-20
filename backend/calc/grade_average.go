package main

import "fmt"

// Convert a string to uppercase manually
func toUpper(s string) string {
	upper := ""
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c >= 'a' && c <= 'z' {
			c = c - 32
		}
		upper += string(c)
	}
	return upper
}

// Convert a string to lowercase manually
func toLower(s string) string {
	lower := ""
	for i := 0; i < len(s); i++ {
		c := s[i]
		if c >= 'A' && c <= 'Z' {
			c = c + 32
		}
		lower += string(c)
	}
	return lower
}

func gradeToPoint(grade string) float64 {
	switch toUpper(grade) {
	case "XCL":
		return 4.25
	case "PRF":
		return 3.25
	case "PP":
		return 2.25
	case "NP":
		return 0.0
	default:
		return -1 // invalid grade
	}
}

func main() {
	var numAssignments int
	fmt.Print("Enter the number of assignments: ")
	fmt.Scan(&numAssignments)

	totalWeightedPoints := 0.0
	totalWeight := 0.0

	for i := 1; i <= numAssignments; i++ {
		var grade string
		var weight float64
		var isFormative string

		fmt.Printf("\nAssignment %d:\n", i)
		fmt.Print("Enter grade (XCL, PRF, PP, NP): ")
		fmt.Scan(&grade)
		fmt.Print("Is this a formative task? (yes/no): ")
		fmt.Scan(&isFormative)

		if toLower(isFormative) == "yes" {
			weight = 100
		} else {
			fmt.Print("Enter assignment weight (as a percentage, e.g., 20 for 20%): ")
			fmt.Scan(&weight)
		}

		points := gradeToPoint(grade)
		if points == -1 {
			fmt.Println("Invalid grade entered. Try again.")
			i--
			continue
		}

		totalWeightedPoints += points * weight
		totalWeight += weight
	}

	finalGrade := totalWeightedPoints / totalWeight
	fmt.Printf("\nFinal weighted grade point: %.2f\n", finalGrade)
}
