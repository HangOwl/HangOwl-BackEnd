import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

// Allow only images
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const id = req.params.id
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const udsc = '_'
  const randomName = require('crypto').randomBytes(12).toString('hex')
  callback(null, `${id}${udsc}${name}${udsc}${randomName}${fileExtName}`);
};