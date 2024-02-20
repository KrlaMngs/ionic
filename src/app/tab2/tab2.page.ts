import { Component } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { GitHubService } from '../services/git-hub.service';
import { SharedReposService } from '../services/shared-repos-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  repoName: string = '';
  repoDescription: string = '';

  constructor(
    private githubService: GitHubService,
    private sharedReposService: SharedReposService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ionViewWillEnter(): void {
    // Limpiar los campos al entrar en la página
    this.repoName = '';
    this.repoDescription = '';
  }

  async createRepo(): Promise<void> {
    // Crea un nuevo repositorio utilizando el servicio GitHubService
    if (this.repoName.trim() !== '' && this.repoDescription.trim() !== '') {
      const confirmAlert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro de crear el repositorio?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Crear',
            handler: () => {
              this.githubService.createRepo(this.repoName, this.repoDescription).subscribe(
                (response) => {
                  console.log('Repositorio creado con éxito:', response);
                  this.presentToast('Repositorio creado con éxito');
                  
                  // Agregar el nuevo repositorio al servicio compartido
                  this.sharedReposService.addRepo(response);
                  
                  // Redirigir a la Tab1 después de la creación
                  this.router.navigate(['/tabs/tab1']);
                },
                (error) => {
                  console.error('Error al crear el repositorio:', error);
                  this.presentToast('Error al crear el repositorio. Por favor, inténtalo nuevamente.');
                }
              );
            }
          }
        ]
      });

      await confirmAlert.present();
    } else {
      this.presentToast('Por favor, completa todos los campos.');
    }
  }

  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: 'dark',
    });

    toast.present();
  }
}
