export class Parking {
    MAC: string;
    city: string;
    address: string;
    location: string;
    nStalls: number;
    isOpen: boolean;
    img: string;
    availableStalls: number;

    constructor(MAC: string, city: string, address: string, location: string, nStalls: number, isOpen: boolean, img: string, availableStalls: number) {
        this.MAC = MAC;
        this.city = city;
        this.address = address;
        this.location = location;
        this.nStalls = nStalls;
        this.isOpen = isOpen;
        this.img = img;
        this.availableStalls = availableStalls;
    }

    // Define a custom equals method to compare Parking objects
    equals(other: Parking): boolean {
        return (
            this.MAC === other.MAC &&
            this.city === other.city &&
            this.address === other.address &&
            this.location === other.location &&
            this.nStalls === other.nStalls &&
            this.isOpen === other.isOpen &&
            this.img === other.img &&
            this.availableStalls === other.availableStalls
        );
    }
}
