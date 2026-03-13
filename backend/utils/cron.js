const cron = require('node-cron');
const Case = require('../models/Case');

const startCronJobs = () => {
  // Run everyday at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running 7-day Escalation Rule for Cases');
    
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const casesToEscalate = await Case.find({
        updatedAt: { $lte: sevenDaysAgo },
        status: { $nin: ['Resolved', 'Escalated'] } // Don't escalate already resolved/escalated cases
      });

      if (casesToEscalate.length > 0) {
        for (let caseItem of casesToEscalate) {
          caseItem.status = 'Escalated';
          await caseItem.save();
          console.log(`Auto-escalated case: ${caseItem.trackingId}`);
        }
      }
    } catch (error) {
      console.error('Error in cron job:', error.message);
    }
  });
};

module.exports = startCronJobs;
