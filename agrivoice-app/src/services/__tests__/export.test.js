import { exportService } from '../export'

// Mock fetch
global.fetch = jest.fn()
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')

describe('Export Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch.mockClear()
  })

  describe('PDF Export', () => {
    test('should download diagnosis PDF', async () => {
      const mockPdfBlob = new Blob(['mock pdf'], { type: 'application/pdf' })
      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockPdfBlob
      })

      // Mock createElement and click
      const mockLink = {
        click: jest.fn(),
        href: '',
        download: '',
      }
      document.createElement = jest.fn(() => mockLink)

      await exportService.downloadDiagnosisPDF('diagnosis-123')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/export/diagnosis/diagnosis-123/pdf'),
        expect.any(Object)
      )
      expect(mockLink.click).toHaveBeenCalled()
    })

    test('should download history PDF', async () => {
      const mockPdfBlob = new Blob(['mock pdf'], { type: 'application/pdf' })
      global.fetch.mockResolvedValueOnce({
        ok: true,
        blob: async () => mockPdfBlob
      })

      const mockLink = {
        click: jest.fn(),
        href: '',
        download: '',
      }
      document.createElement = jest.fn(() => mockLink)

      await exportService.downloadHistoryPDF()

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/export/history/pdf'),
        expect.any(Object)
      )
      expect(mockLink.click).toHaveBeenCalled()
    })

    test('should handle export errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' })
      })

      await expect(exportService.downloadDiagnosisPDF('invalid-id')).rejects.toThrow()
    })
  })

  describe('PDF Preview', () => {
    test('should get diagnosis PDF preview', async () => {
      const mockBase64 = 'base64-encoded-pdf-data'
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { base64_pdf: mockBase64 }
        })
      })

      const result = await exportService.getPreviewPDF('diagnosis-123')

      expect(result).toBe(mockBase64)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/export/diagnosis/diagnosis-123/preview'),
        expect.any(Object)
      )
    })

    test('should get history PDF preview', async () => {
      const mockBase64 = 'base64-encoded-history-pdf'
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { base64_pdf: mockBase64 }
        })
      })

      const result = await exportService.getHistoryPreviewPDF()

      expect(result).toBe(mockBase64)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/export/history/preview'),
        expect.any(Object)
      )
    })

    test('should handle preview errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(exportService.getPreviewPDF('invalid')).rejects.toThrow()
    })
  })
})
