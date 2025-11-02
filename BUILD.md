# 📦 Guía de Empaquetado - GymDesk

## ✅ Pre-requisitos

Antes de empaquetar, asegúrate de que:

1. **Backend compilado**: El backend debe estar compilado en `../GymDesk-backend/dist`
2. **Base de datos**: Debe existir `../GymDesk-backend/data/app.db`
3. **Variables de entorno**: Archivo `.env` configurado en el backend
4. **Icono**: Archivo `build/icon.ico` debe existir

## 🚀 Pasos para empaquetar

### 1. Compilar CSS y Backend (automático)
```bash
npm run build
```

Este comando ejecuta automáticamente:
- Compilación de Tailwind CSS
- Compilación del backend NestJS
- Empaquetado con electron-builder

### 2. Resultado

El instalador se generará en:
```
GymDesk-desktop/dist/GymDesk Setup 1.0.0.exe
```

## 📋 Checklist antes de empaquetar

- [ ] Backend compilado sin errores
- [ ] Base de datos existe y tiene licencias generadas
- [ ] Variables de entorno configuradas (.env)
- [ ] CSS compilado (dist/output.css)
- [ ] Icono presente (build/icon.ico)
- [ ] node_modules instalados en backend
- [ ] Última versión commiteada a git

## 🔍 Verificación post-empaquetado

Después de instalar la aplicación, verifica:

1. ✅ La aplicación inicia correctamente
2. ✅ El backend NestJS se ejecuta en puerto 4001
3. ✅ La base de datos funciona (login/registro)
4. ✅ El sistema de licencias funciona
5. ✅ No hay errores en la consola

## 📁 Estructura de la aplicación empaquetada

```
C:\Users\[User]\AppData\Local\Programs\GymDesk\
├── GymDesk.exe
├── resources/
│   ├── app.asar (aplicación frontend empaquetada)
│   ├── app.asar.unpacked/
│   │   ├── src/ (archivos HTML, JS, CSS)
│   │   └── build/icon.ico
│   └── backend/
│       ├── main.js (backend compilado)
│       ├── node_modules/
│       ├── data/
│       │   └── app.db
│       └── package.json
```

## ⚙️ Configuración de producción

La aplicación detecta automáticamente si está en desarrollo o producción:
- **Desarrollo**: `!app.isPackaged`
- **Producción**: `app.isPackaged`

Variables de entorno en producción:
- `NODE_ENV=production`
- `PORT=4001`

## 🐛 Solución de problemas

### La app no inicia
- Verifica que `backend/main.js` existe en resources
- Revisa los logs en `AppData\Roaming\GymDesk`

### Base de datos vacía
- Asegúrate de copiar `data/app.db` antes de empaquetar
- Verifica que `extraResources` incluye la carpeta data

### Backend no inicia
- Verifica que node_modules del backend estén incluidos
- Revisa que NODE_PATH apunte a `backend/node_modules`

## 📝 Notas importantes

1. **Tamaño del instalador**: ~300-500 MB (incluye node_modules del backend)
2. **Tiempo de build**: 2-5 minutos dependiendo del hardware
3. **Sistema operativo**: Windows x64 solamente
4. **Requisitos de instalación**: No requiere Node.js instalado

## 🔐 Seguridad

- Los códigos de licencia solo se muestran en desarrollo
- JWT usa secret desde variables de entorno
- Base de datos SQLite local (no expuesta)

---

**Desarrollado por**: GymDesk Development Team
**Versión**: 1.0.0
