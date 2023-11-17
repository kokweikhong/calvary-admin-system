package main

import (
	"fmt"
	"log"

	"github.com/kokweikhong/calvary-admin-system/filesystem-service/internal/routes"
)

func main() {
	fmt.Println("Hello World")

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	router := routes.Init()
	routes.Run(":8080", router)
}
