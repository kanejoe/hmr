export default function(app, mongoose) {

const reqsQuerySchema = new mongoose.Schema({
  header: { type: String, default: '' },
  order: { type: Number, default: 0 },
  timeCreated: { type: Date, default: Date.now },
}, { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

reqsQuerySchema.index({ title: 1 });
reqsQuerySchema.set('autoIndex', (app.get('env') === 'development'));
app.db.model('ReqsQuery', reqsQuerySchema);
};
