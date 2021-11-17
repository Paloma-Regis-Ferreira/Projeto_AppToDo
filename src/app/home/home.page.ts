import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { toastController } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tasks: any[] = [];//criando objeto vazio
  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController) {
    let taskJson = localStorage.getItem('taskdb');//armazenando apos carregar
    if(taskJson!=null){
      this.tasks = JSON.parse(taskJson);
    }
  }//fim do bloco de armazenamento
  async showAdd(){
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'O q deseja fazer?'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('clicked cancel');
          }
        },
        {
          text: 'Adiocionar',
          handler: (form) => {
          this.add(form.taskToDo);
          }
        }
      ]
    });
    await alert.present();
  }

  async add(taskToDo: string){
    //valida se o usuario preencheu a tarefa
    if(taskToDo.trim().length < 1){
      const toast = await this.toastCtrl.create({
        message : 'Informe o que deseja fazer',
        duration: 2000,
        position : 'top'
      });

      toast.present();
      return;
    }

    let task = {name: taskToDo, done: false};//insere a tarefa na lista
    this.tasks.push(task);
    this.updateLocalStorage();
  }

  updateLocalStorage(){
    localStorage.setItem('taskdb', JSON.stringify(this.tasks));
  }//fim da inserção

  async openActions(task: any){
    const actionSheet = await this.actionSheetCtrl.create({
      header: "O QUE DESEJA FAZER?",
      buttons: [{
        text: task.done? 'Desmarcar' : 'Marcar',
        icon: task.done? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;
          this.updateLocalStorage();
        }
      },
       {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
