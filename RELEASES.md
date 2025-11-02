# 🚀 Guía de Releases y Auto-Updates - GymDesk

## ✅ Configuración Completada

Tu proyecto ya está configurado para:
- ✅ Auto-actualización automática desde GitHub Releases
- ✅ Notificaciones de actualización para usuarios
- ✅ Build automatizado con GitHub Actions
- ✅ Publicación automática en GitHub Releases

---

## 📋 Proceso de Creación de una Nueva Versión

### **Opción 1: Release Automático con GitHub Actions** ⭐ (Recomendado)

```powershell
# 1. Aumentar la versión en package.json
npm version patch  # 1.0.0 → 1.0.1
# O manualmente edita "version" en package.json

# 2. Hacer commit de los cambios
git add .
git commit -m "Preparar release v1.0.1"

# 3. Crear y pushear el tag
git tag v1.0.1
git push origin main
git push origin v1.0.1

# 4. GitHub Actions automáticamente:
#    - Compilará el backend
#    - Compilará el CSS
#    - Creará el instalador .exe
#    - Creará el release en GitHub
#    - Subirá los archivos
```

### **Opción 2: Release Manual**

```powershell
# 1. Asegúrate de estar en la carpeta desktop
cd "c:\Users\woody\Desktop\Proyectos\GymDesk\GymDesk-desktop"

# 2. Aumentar versión
npm version patch

# 3. Hacer build local
npm run build

# 4. Ir a GitHub → Releases → New Release
# 5. Crear tag v1.0.1
# 6. Subir estos archivos desde dist/:
#    - GymDesk Setup 1.0.1.exe
#    - latest.yml
```

---

## 🔄 Tipos de Versiones

```powershell
npm version patch   # 1.0.0 → 1.0.1 (correcciones de bugs)
npm version minor   # 1.0.0 → 1.1.0 (nuevas funcionalidades)
npm version major   # 1.0.0 → 2.0.0 (cambios importantes)
```

---

## 👥 Cómo Funciona para los Usuarios

### **Primera Instalación**
1. Usuario descarga `GymDesk Setup 1.0.0.exe` desde GitHub Releases
2. Instala la aplicación normalmente
3. La app funciona sin necesidad de Node.js instalado

### **Actualizaciones Automáticas**
1. **Verificación automática**: La app verifica updates 3 segundos después de iniciar
2. **Notificación**: Si hay una nueva versión, aparece un diálogo:
   ```
   "Una nueva versión 1.0.1 está disponible"
   [Descargar] [Más tarde]
   ```
3. **Descarga**: Si acepta, descarga la actualización en segundo plano
4. **Instalación**: Al terminar, aparece:
   ```
   "La actualización se ha descargado correctamente"
   [Reiniciar ahora] [Reiniciar al cerrar]
   ```
5. **Actualización completa**: La app se reinicia con la nueva versión

---

## 🔧 Configuración del Auto-Updater

### **Comportamiento Actual**

```javascript
// Solo funciona en producción (app empaquetada)
// En desarrollo no verifica updates

autoUpdater.autoDownload = false;           // Usuario decide si descargar
autoUpdater.autoInstallOnAppQuit = true;    // Instala al cerrar la app
```

### **Frecuencia de Verificación**
- Al iniciar la aplicación (después de 3 segundos)
- Solo en modo producción (app instalada)

---

## 📁 Archivos Necesarios en GitHub Release

Para que funcione el auto-update, DEBES subir estos archivos:

```
✅ GymDesk Setup 1.0.1.exe    (Instalador para nuevos usuarios)
✅ latest.yml                  (Metadatos para auto-update)
```

El archivo `latest.yml` contiene:
```yaml
version: 1.0.1
files:
  - url: GymDesk Setup 1.0.1.exe
    sha512: ...
    size: 123456789
path: GymDesk Setup 1.0.1.exe
sha512: ...
releaseDate: 2025-11-01T...
```

---

## 🐛 Solución de Problemas

### **El auto-update no funciona**

1. **Verificar que estés en producción**
   - El auto-update NO funciona en desarrollo (`npm start`)
   - Solo funciona en la app instalada

2. **Verificar los archivos en GitHub Release**
   - Debe existir el release con el tag (ej: v1.0.1)
   - Deben estar los archivos .exe y latest.yml
   - El release debe estar publicado (no draft)

3. **Verificar la versión**
   - La versión en GitHub debe ser MAYOR que la instalada
   - Formato correcto: v1.0.1 (con 'v')

4. **Revisar logs**
   - Abre DevTools en la app instalada: Ctrl+Shift+I
   - Busca mensajes de auto-updater en la consola

### **Error: "Cannot find module electron-updater"**
```powershell
npm install electron-updater
```

### **GitHub Actions falla**
- Verifica que el repositorio del backend exista
- Asegúrate de que GITHUB_TOKEN tenga permisos de write

---

## 📊 Ejemplo de Workflow Completo

```powershell
# Paso 1: Hacer cambios en el código
# ... editas archivos ...

# Paso 2: Commit cambios
git add .
git commit -m "Agregar nueva funcionalidad X"

# Paso 3: Aumentar versión
npm version minor  # 1.0.0 → 1.1.0

# Paso 4: Push con tag
git push origin main
git push origin v1.1.0

# Paso 5: Esperar GitHub Actions (5-10 minutos)
# - Se crea el release automáticamente
# - Se suben los archivos

# Paso 6: Los usuarios con la app instalada:
# - Reciben notificación de update
# - Descargan e instalan la nueva versión
```

---

## 🔐 Seguridad

- ✅ Las actualizaciones se verifican con hash SHA512
- ✅ Solo se descargan desde GitHub (oficial)
- ✅ El usuario debe aprobar la descarga
- ✅ Proceso firmado por electron-builder

---

## 📝 Notas Importantes

1. **Primer Release**: Debes crear manualmente el primer release (v1.0.0)
2. **Versión inicial**: Los usuarios deben descargar e instalar manualmente la primera vez
3. **Updates posteriores**: Son automáticos
4. **Desarrollo**: Auto-update está deshabilitado en modo desarrollo
5. **Producción**: Se activa automáticamente en la app instalada

---

## 🎯 Checklist antes de Crear un Release

- [ ] Código testeado y funcionando
- [ ] Versión actualizada en package.json
- [ ] Cambios commiteados a git
- [ ] Tag creado (v1.0.x)
- [ ] Push realizado a GitHub
- [ ] GitHub Actions completado exitosamente
- [ ] Release publicado (no draft)
- [ ] Archivos .exe y .yml presentes en el release

---

**Desarrollado por**: GymDesk Development Team  
**Última actualización**: Noviembre 2025
