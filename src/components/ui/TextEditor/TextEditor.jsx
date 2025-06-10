import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Table,
    Heading,
    TableToolbar,
    List,
    ListProperties,
    Indent,
    IndentBlock,
    BlockQuote,
    Alignment,
    Image,
    ImageInsert,
    ImageToolbar,
    ImageEditing,
    ImageResize,
    ImageResizeEditing,
    ImageResizeHandles,
    ImageStyle,
    ImageCaption,
    Base64UploadAdapter,
    CodeBlock,
    SourceEditing,
    FindAndReplace
} from 'ckeditor5';
import MathType from '@wiris/mathtype-ckeditor5/dist/index.js';

import DisableImagePaste from './customPlugins/DisableImagePaste';

import ruTranslations from 'ckeditor5/translations/ru.js'

import 'ckeditor5/ckeditor5.css';

const TextEditor = ({ value, onChange, pasteFromClipboard = true, canUploadImage = true, ...props }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            config={{
                licenseKey: 'GPL',
                plugins: [
                    Essentials,
                    Paragraph,
                    Bold,
                    Italic,
                    FindAndReplace,
                    Heading,
                    Table,
                    TableToolbar,
                    List,
                    ListProperties,
                    Indent,
                    IndentBlock,
                    MathType,
                    BlockQuote,
                    Alignment,
                    Image,
                    ImageInsert,
                    ImageEditing,
                    ImageToolbar,
                    ImageResize,
                    ImageResizeEditing,
                    ImageResizeHandles,
                    ImageStyle,
                    ImageCaption,
                    Base64UploadAdapter,
                    DisableImagePaste,
                    CodeBlock,
                    SourceEditing
                ],
                toolbar: [
                    'undo', 'redo', '|',
                    'heading', '|',
                    'bold', 'italic', '|',
                    'findAndReplace', 'insertTable', 'bulletedList', 'numberedList', 'indent', 'outdent', '|',
                    'MathType', 'ChemType', '|',
                    'blockQuote', 'alignment', `${canUploadImage ? 'insertImageViaUrl' : ''}`, '|',
                    'codeBlock', 'sourceEditing',
                ],
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:alignLeft',
                        'imageStyle:alignCenter',
                        'imageStyle:alignRight',
                        '|',
                        'resizeImage'
                    ],
                    resizeUnit: "%",
                    resizeOptions: [
                        { name: 'resizeImage:original', value: null, label: 'Оригинальный размер' },
                        { name: 'resizeImage:custom', label: 'Другой размер', value: 'custom' },
                        { name: 'resizeImage:50', value: '50', label: '50%' },
                        { name: 'resizeImage:75', value: '75', label: '75%' }
                    ]
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                translations: [ruTranslations]
            }}
            onReady={(editor) => {
                if (!pasteFromClipboard) {
                    editor.editing.view.document.on('clipboardInput', (evt, data) => evt.stop())
                }
            }}
            onChange={(event, editor) => onChange && onChange(editor.getData())}
            data={value}
            {...props}
        />
    )
}

export default TextEditor