package main

import (
	"log"

	"github.com/kokweikhong/calvary-admin-system/main-service/internal/config"
	"github.com/kokweikhong/calvary-admin-system/main-service/internal/routes"
)

func main() {

	log.SetFlags(log.LstdFlags | log.Lshortfile)

	if err := config.Init(); err != nil {
		panic(err)
	}

	router := routes.Init()
	routes.Run(router, config.Cfg.ServerPort)

}
