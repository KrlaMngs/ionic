import { Component, OnDestroy } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { GitHubService } from '../services/git-hub.service';
import { SharedReposService } from '../services/shared-repos-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnDestroy {
  repos: any[] = [];
  private reposSubscription: Subscription;

  constructor(
    private githubService: GitHubService,
    private sharedReposService: SharedReposService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    // Suscribirse al servicio compartido para recibir actualizaciones de repositorios
    this.reposSubscription = this.sharedReposService.repos$.subscribe(repos => {
      this.repos = repos;
    });
  }

  ionViewWillEnter(): void {
    // Actualiza la lista de repositorios al entrar en la vista
    this.refreshRepoList();
  }

  ngOnDestroy(): void {
    // Desechar la suscripción cuando el componente se destruye
    this.reposSubscription.unsubscribe();
  }

  refreshRepoList(): void {
    console.log('Refrescando lista de repositorios...');
    this.githubService.getUserRepos().subscribe(
      (response) => {
        console.log('Respuesta del servidor:', response);
        // Actualizar la lista de repositorios en el servicio compartido
        this.sharedReposService.updateRepos(response);
      },
      (error) => {
        console.error('Error al obtener los repositorios:', error);
      }
    );
  }
  
  async confirmDelete(owner: string, repo: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el repositorio ${repo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteRepository(owner, repo);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteRepository(owner: string, repo: string): void {
    this.githubService.deleteRepository(owner, repo)
      .subscribe(
        () => {
          console.log('Repositorio eliminado exitosamente');
          this.presentToast('Repositorio eliminado exitosamente');
          // Actualizar la lista de repositorios obteniendo los repositorios actualizados del servidor
          this.refreshRepoList();
        },
        error => {
          console.error('Error al eliminar el repositorio', error);
          this.presentToast('Error al eliminar el repositorio');
        }
      );
  }

  async editRepository(owner: string, repo: string): Promise<void> {
    const repoToUpdate = this.repos.find((r) => r.name === repo);
    const alert = await this.alertController.create({
      header: 'Editar Repositorio',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: repoToUpdate.name,
          placeholder: 'Nombre del Repositorio',
        },
        {
          name: 'description',
          type: 'text',
          value: repoToUpdate.description,
          placeholder: 'Descripción',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.saveEdit(owner, repo, data.name, data.description);
          },
        },
      ],
    });

    await alert.present();
  }

  async saveEdit(owner: string, repo: string, newName: string, newDescription: string): Promise<void> {
    this.githubService.editRepository(owner, repo, newName, newDescription)
      .subscribe(
        () => {
          console.log('Repositorio editado exitosamente');
          this.presentToast('Repositorio editado exitosamente');
  
          // Actualizar el repositorio editado en la lista local
          const editedRepoIndex = this.repos.findIndex(r => r.name === repo);
          if (editedRepoIndex !== -1) {
            this.repos[editedRepoIndex].name = newName;
            this.repos[editedRepoIndex].description = newDescription;
            // Actualizar la lista de repositorios en el servicio compartido
            this.sharedReposService.updateRepos(this.repos);
          }
        },
        error => {
          console.error('Error al editar el repositorio', error);
          this.presentToast('Error al editar el repositorio');
        }
      );
  }

  async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
