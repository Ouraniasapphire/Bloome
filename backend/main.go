//go:build js && wasm
// +build js,wasm

package main

import (
	"syscall/js"
)

func add(this js.Value, args []js.Value) interface{} {
    a := args[0].Int()
    b := args[1].Int()
    sum := a + b
    return sum
}


func sub(this js.Value, args []js.Value) interface{} {
	a := args[0].Int()
	b := args[1].Int()
	sum := a - b
	return sum
}

func main() {

	g := js.Global()

    g.Set("addNumbers", js.FuncOf(add))
	g.Set("subNumbers", js.FuncOf(sub))

    select {} // keep Go running
}
