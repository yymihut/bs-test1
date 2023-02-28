import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
//import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Post } from './post.model';

//*****realtime database */
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private dbPath = '/mesaje';
  mesajeRef: AngularFireList<Post>;

  constructor(private db: AngularFireDatabase) {
    this.mesajeRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Post> {
    return this.mesajeRef;
  }

  create(mesaj: Post): any {
    return this.mesajeRef.push(mesaj);
  }

  update(key: string, value: any): Promise<void> {
    return this.mesajeRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.mesajeRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.mesajeRef.remove();
  }

}




//*****firestore database */
// @Injectable({
//   providedIn: 'root'
// })
// export class DataServiceService {
//   private dbPath = '/';
//   mesajeRef: AngularFirestoreCollection<Post>;

//   constructor(private db: AngularFirestore) {
//     this.mesajeRef = db.collection(this.dbPath);
//   }
//   getAll(): AngularFirestoreCollection<Post> {
//     return this.mesajeRef;
//   }

//   create(tutorial: Post): any {
//     return this.mesajeRef.add({ ...tutorial });
//   }

//   update(id: string, data: any): Promise<void> {
//     return this.mesajeRef.doc(id).update(data);
//   }

//   delete(id: string): Promise<void> {
//     return this.mesajeRef.doc(id).delete();
//   }
// }
