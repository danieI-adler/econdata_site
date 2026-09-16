# Instruções de Publicação no GitHub Pages - EconData Analytics

Este website estático foi construído e otimizado especificamente para rodar no **GitHub Pages**.

## Como publicar no GitHub Pages em 3 passos:

1. **Inicializar o repositório git local (caso ainda não tenha feito):**
   `ash
   git init
   git add .
   git commit -m "feat: website institucional do EconData Analytics"
   `

2. **Conectar ao repositório do EconData no GitHub:**
   `ash
   git branch -M main
   git remote add origin https://github.com/<usuario-ou-organizacao>/<nome-do-repositorio>.git
   git push -u origin main
   `

3. **Ativar o GitHub Pages:**
   - Acesse o repositório no GitHub: **Settings** > **Pages**
   - Em **Build and deployment** > **Source**: Selecione **Deploy from a branch**
   - Branch: Selecione main e pasta /(root)
   - Clique em **Save**.
   - Em cerca de 1 a 2 minutos seu site estará no ar na URL oficial (ex: https://<usuario>.github.io/<repositorio>/).
