export const scheduled: ExportedHandlerScheduledHandler<Env> = async (
  event,
  env,
  ctx,
): Promise<void> => {
  console.log('Scheduled event triggered')
}
