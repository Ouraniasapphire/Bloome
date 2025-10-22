//go:build js && wasm
// +build js,wasm

package main

import (
	"syscall/js"
)

func buttonActive(this js.Value, args []js.Value) interface{} {
    a := args[0].Bool()
	a = !a
    return a
}

func incNum(this js.Value, args []js.Value) interface{} {
	a := args[0].Int();
	a = a + 1

	return a
}


func main() {

	g := js.Global()
	g.Set("bActive", js.FuncOf(buttonActive))
	g.Set("incNum", js.FuncOf(incNum))

    select {} // keep Go running
}
