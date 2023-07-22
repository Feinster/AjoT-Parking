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

    // Define a custom equals method to compare Stall objects
    equals(other: Stall): boolean {
        return (
            this.id === other.id &&
            this.GPIO === other.GPIO &&
            this.MAC_parking === other.MAC_parking &&
            this.isFree === other.isFree
        );
    }
}
