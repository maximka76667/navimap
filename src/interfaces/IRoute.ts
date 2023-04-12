import IBusStop from "./IBusStop";

export default interface IRoute {
    name: string,
    route: IBusStop[]
}