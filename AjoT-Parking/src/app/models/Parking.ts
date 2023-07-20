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
}
