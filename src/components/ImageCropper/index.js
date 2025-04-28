import React, { useState, useCallback } from 'react';
import "./styles.css";
import Cropper from 'react-easy-crop';

export default function ImageCropper({ width = 500, height = 500, onImageCropped }) {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImage(imageDataUrl);
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.readAsDataURL(file);
        });
    };

    const getCroppedImg = (imageSrc, croppedAreaPixels) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    width,
                    height
                );

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    resolve(blob);
                }, 'image/jpeg');
            };
        });
    };

    const showCroppedImage = async () => {
        try {
            // const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
            // setCroppedImage(croppedImageUrl);

            const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
            setCroppedImage(URL.createObjectURL(croppedBlob));
            onImageCropped(croppedBlob);

            setImage(null);
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className="container">
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {image && <>
                <div className="crop-container">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={width / height}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <button onClick={showCroppedImage} className='crop-button'>Cortar Imagem</button>
            </>}

            {(croppedImage && !image) && (
                <div className="cropped-image">
                    <img src={croppedImage} alt="Imagem Cortada" />
                </div>
            )}
        </div>
    );
}
