"use strict";

namespace core {

    export class Router {

        private _activeLink:string;

        private _routingTable:string[];

        private _linkData:string;


        constructor() {
            this._activeLink = "";
            this._routingTable = [];
            this._linkData = "";
        }

        public get LinkData():string {
            return this._linkData;
        }

        public set LinkData(link:string) {
            this._linkData = link;
        }

        public get ActiveLink():string {
            return this._activeLink;
        }

        public set ActiveLink(link:string) {
            this._activeLink = link;
        }
        /**
         *  This method adds a new route to the Routing Table
         * @param route
         * @returns {void}
         */
        public Add(route:string) {
            this._routingTable.push(route);
        }


        /**
         * This method replaces the references for the routing table with a new one
         * @param routingTable
         * @returns {void}
         */
        public AddTable(routingTable:string[]) {
            this._routingTable = routingTable;
        }

        /**
         * This method find and returns the index of the route in the Routing table, otherwise it returns -1
         * @param route
         * @returns {boolean}
         */
        public Find(route:string):number {
            return this._routingTable.indexOf(route);
        }
        /**
         * This method removes a Route form the Routing table. It returns true if the route was successfully removed
         * @param route
         * @returns {boolean}
         */
        public Remove(route:string):boolean {
            if(this.Find(route) > -1){
                this._routingTable.splice(this.Find(route), 1)
                return true;
            }
            return false;
        }
        /**
         * This method returns the routing table contents in a comma separate string (array toString default)
         * @returns {string}
         */
        public toString():string {
            return this._routingTable.toString();
        }


    }
}

// Instantiate Router
let router = new core.Router();

router.AddTable([
    "/",
    "/home",
    "/portfolio",
    "/services",
    "/gallery",
    "/team",
    "/blog",
    "/events",
    "/login",
    "/register",
    "/Terms-of-Service",
    "/Privacy-Policy",
    "/contact",
    "/contact-list",
    "edit",
    "/statistics",
    "/Event-Planning"

]);

let route = location.pathname;

router.ActiveLink = (router.Find(route) > -1) ? ( (route === "/") ? "home" : route.substring(1)) : ("404");
