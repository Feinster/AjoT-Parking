export class Parking {
    MAC: string;
    city: string;
    address: string;
    location: string;
    nStalls: number;
    isOpen: boolean;
    img: string;
    availableStalls: number;
    brightnessThreshold: number;

    constructor(MAC: string, city: string, address: string, location: string, nStalls: number, isOpen: boolean, img: string, availableStalls: number, brightnessThreshold: number) {
        this.MAC = MAC;
        this.city = city;
        this.address = address;
        this.location = location;
        this.nStalls = nStalls;
        this.isOpen = isOpen;
        this.img = img;
        this.availableStalls = availableStalls;
        this.brightnessThreshold = brightnessThreshold;
    }

    // Define a custom equals method to compare Parking objects
    equals(other: Parking): boolean {
        return (
            this.MAC === other.MAC
        );
    }
}
