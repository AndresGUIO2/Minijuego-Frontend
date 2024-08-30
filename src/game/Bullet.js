class Bullet {
    constructor(scene, spriteKey) {
      this.scene = scene;
      this.group = scene.physics.add.group({
        defaultKey: spriteKey,
        maxSize: 50 // Sin límite en el tamaño del grupo
      });
    }
  
    createBullet(x, y, targetX, targetY) {
      // Busca una bala inactiva en el grupo
      const bullet = this.group.get(x, y);
      if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
  
        // Calcular la dirección
        const directionX = targetX - x;
        const directionY = targetY - y;
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
  
        // Normalizar la dirección
        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;
  
        // Establecer la velocidad
        const speed = 550;
        bullet.setVelocityX(normalizedX * speed);
        bullet.setVelocityY(normalizedY * speed);
  
        return bullet;
      }
    }
  
    updateFromServer(bullets) {
      // Lógica para actualizar balas desde el servidor si es necesario
      // Ejemplo:
      // this.group.children.each((bullet) => {
      //   if (bullets[bullet.id]) {
      //     bullet.setPosition(bullets[bullet.id].x, bullets[bullet.id].y);
      //   }
      // });
    }
  
    update() {
      // Lógica para actualizar balas en el cliente
      this.group.children.each((bullet) => {
        // Desactivar balas que han salido de la pantalla
        if (bullet.y < 0 || bullet.y > this.scene.sys.canvas.height || bullet.x < 0 || bullet.x > this.scene.sys.canvas.width) {
          bullet.setActive(false);
          bullet.setVisible(false);
        }
      });
    }
  }
  
  export default Bullet;