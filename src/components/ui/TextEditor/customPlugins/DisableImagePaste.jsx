import {Plugin} from 'ckeditor5'

class DisableImagePaste extends Plugin {
  init() {
    const editor = this.editor;
    
    editor.editing.view.document.on('clipboardInput', (evt, data) => {
      const dataValue = data.dataTransfer.getData('text/html');
      if (dataValue && dataValue.includes('<img')) {
        // Если в данных есть теги изображений, блокируем вставку
        evt.stop();
        editor.plugins.get('Notification').showWarning(
          'Вставка изображений из буфера обмена отключена. Пожалуйста, используйте URL.',
          {
            namespace: 'paste',
            title: 'Предупреждение'
          }
        );
      }
    });
  }
}

export default DisableImagePaste