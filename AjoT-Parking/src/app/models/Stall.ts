export class Stall {
    id: number;
    GPIO: number;
    MAC_parking: string;
    isFree: boolean;

    constructor(id: number, GPIO: number, MAC_parking: string, isFree: boolean) {
        this.id = id;
        this.GPIO = GPIO;
        this.MAC_parking = MAC_parking;
        this.isFree = isFree;
    }
}
