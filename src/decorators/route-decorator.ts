export const routesRegister = new Array<any>();

export const routeDecorator = (router: any) => {    
    return (target: any, property: string) => {
        target[property] = router;
        routesRegister.push(router);
    }
};

export function setRoutes(app: any) {
    routesRegister.forEach(route => app.use(route))
};