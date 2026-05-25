import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Usuario {         //fazer a interface dos usuarios
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  imports: [FormsModule, ReactiveFormsModule, CommonModule ],      //importar os modules
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth implements OnInit {         //fazer a interface dos usuarios
  form!: FormGroup;
  isLoginMode = true;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ){}


  ngOnInit(): void {
    this.setupForm();
  }

  setupForm():void {
    this.form = this.fb.group({
      name:[''],
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required, Validators.minLength(6)]]
    })
  }
  toggleMode(): void{
    this.isLoginMode = !this.isLoginMode
  }
  getUsuarios(): Usuario[]{
    const dados = localStorage.getItem('usuarios');
    return dados? JSON.parse(dados) : [];
  }
  salvarUsuarios(lista: Usuario[]): void{
    localStorage.setItem('usuarios', JSON.stringify(lista))
  }
  onSubmit():void {
    console.log('Form submit enviado!')
    if(this.form.invalid)return;
    console.log('Form Invalido', this.form.errors)

    const {name, email, password} = this.form.value;
    const usuarios = this.getUsuarios();

    if(this.isLoginMode) {
      const usuario = usuarios.find(u => u.email === email && u.password === password);
      if(usuario) {
        console.log('login bem sucedido!', usuario);
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
        this.router.navigate(['/home'])
      } else{
        alert('Email ou senha invalidos!')
      }
    } else {
      const usuarioJaExiste = usuarios.some(u => u.email === email)


      if(usuarioJaExiste) {
        alert('Este email já está cadastrado!');
        return
      }

      const novoUsuario : Usuario = {name, email, password};
      usuarios.push(novoUsuario);
      this.salvarUsuarios(usuarios);
      alert('Cadastro criado com sucesso!')
      this.toggleMode();
      this.form.reset();

    }
  }
}
