import { Request, Response, NextFunction } from 'express';
import { uploadToSupabase } from '../lib/supabase-service';

export async function uploadPDF(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            res.status(400).json({ 
                success: false, 
                error: 'No file uploaded'
            });
            return;
        }

        const { data, error } = await uploadToSupabase(req.file);
        
        if (error) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to upload to storage' 
            });
            return;
        }

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
}