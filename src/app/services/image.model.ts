export class Image {
  public id: number;
  public name: string;
  public description: string;
  public imagePath: string;

  constructor (id:number, name: string, description: string, image: string) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.imagePath = image;
  }
}
