import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default function(app, mongoose) {

  const reqsSchema = new Schema({
    title: { type: String, default: '' },
    queries: [ mongoose.modelSchemas.ReqsQuery ],
    timeCreated: { type: Date, default: Date.now },
  }, { toObject: { virtuals: true }, toJSON: { virtuals: true } }
  );

  reqsSchema.index({ title: 1 });
  reqsSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Reqs', reqsSchema);
};
