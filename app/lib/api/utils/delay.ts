export default function delay(timeout: number) {
  return new Promise(res => setTimeout(res, timeout))
}
