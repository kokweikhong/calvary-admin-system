package main

import (
	"log"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/config"
)

func main() {

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	if err := config.Init(); err != nil {
		panic(err)
	}

}
