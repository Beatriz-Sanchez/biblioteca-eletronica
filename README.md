<div>
  <img alt="Byju's Teaching" src="https://img.shields.io/static/v1?label=Byju's&message=Teaching&color=gray&labelColor=purple">
  
</div>

# Biblioteca Eletrônica
<img src="https://raw.githubusercontent.com/Beatriz-Sanchez/biblioteca-eletronica/73-completa/assets/appIcon.png" width="200px">

Um app mobile que visa providenciar uma solução de administração de bibliotecas, para escolas com poucos recursos e sem uma bibliotecária. Construído com React-Native

Ao desenvolver este app, os alunos aprendem:
- gerenciamento de versões com Git e GitHub
- criação de componentes de navegação
- ciclo de vida dos componentes React Native
- criação e manipulação de estados dos componentes React Native
- criação e manipulação de banco de dados Firebase Firestore


## Funcionalidades

### Tela de Transações: 

<img src="https://github.com/Beatriz-Sanchez/biblioteca-eletronica/blob/main/assets/biblio-transacoes-cropped.gif?raw=true" width="300">

- entrada de ID de aluno e de ID de livro por digitalização de QR code ou manualmente
- confere disponibilidade do livro para detectar se a transação será uma devolução ou uma retirada
- confere eligibilidade do aluno para a realização da transação e automaticamente realiza a transação desejada caso ela seja possível
- feedback para o usuário por meio de Toast caso algum dos IDs não seja encontrado ou o aluno não se encontre elegivel para a aretirada do livro
