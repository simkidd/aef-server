import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { orgRoutes } from './org.routes.js';
import { staffRoutes } from './staff.routes.js';
import { centreRoutes } from './centre.routes.js';
import { programRoutes } from './program.routes.js';
import { cohortRoutes } from './cohort.routes.js';
import { applicationRoutes } from './application.routes.js';
import { enrollmentRoutes } from './enrollment.routes.js';
import { biometricRoutes } from './biometric.routes.js';
import { attendanceRoutes } from './attendance.routes.js';
import { certificateRoutes } from './certificate.routes.js';
import { announcementRoutes } from './announcement.routes.js';
import { reportRoutes } from './report.routes.js';
import { adminRoutes } from './admin.routes.js';
import { galleryRoutes } from './gallery.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/org', orgRoutes);
apiRouter.use('/staff', staffRoutes);
apiRouter.use('/centres', centreRoutes);
apiRouter.use('/programs', programRoutes);
apiRouter.use('/cohorts', cohortRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);
apiRouter.use('/biometrics', biometricRoutes);
apiRouter.use('/attendance', attendanceRoutes);
apiRouter.use('/certificates', certificateRoutes);
apiRouter.use('/announcements', announcementRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/gallery', galleryRoutes);

export { apiRouter };
