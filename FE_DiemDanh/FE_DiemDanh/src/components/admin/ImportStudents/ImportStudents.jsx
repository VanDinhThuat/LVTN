import { Button, Input, Page, Text, Box, useSnackbar, useNavigate } from "zmp-ui"
import "./ImportStudents.scss"
import { useState } from "react"
import axios from "axios"
import { url } from "../../../AppConfig/AppConfig"
import React from "react"

const ImportStudents = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [importResult, setImportResult] = useState(null)
    const [error, setError] = useState("")
    const { openSnackbar } = useSnackbar()
    const navigate = useNavigate()

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Validate file type
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                'application/vnd.ms-excel' // .xls
            ]
            
            if (!allowedTypes.includes(file.type)) {
                setError("Vui lòng chọn file Excel (.xlsx hoặc .xls)")
                setSelectedFile(null)
                return
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB")
                setSelectedFile(null)
                return
            }

            setSelectedFile(file)
            setError("")
            setImportResult(null)
        }
    }

    const handleImport = async () => {
        if (!selectedFile) {
            setError("Vui lòng chọn file Excel để import")
            return
        }

        setLoading(true)
        setError("")
        setImportResult(null)

        try {
            const formData = new FormData()
            formData.append('file', selectedFile)

            const response = await axios.post(`${url}/api/admin/users/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const result = response.data
            setImportResult(result)

            if (result.success) {
                openSnackbar({
                    text: `Import thành công ${result.imported} sinh viên!`,
                    type: 'success',
                    duration: 5000
                })
            } else {
                setError(result.message || "Có lỗi xảy ra khi import")
            }

        } catch (error) {
            console.error("Import error:", error)
            setError(error.response?.data?.message || "Đã xảy ra lỗi khi import file")
        } finally {
            setLoading(false)
        }
    }

    const downloadTemplate = () => {
        // Create a sample Excel template structure
        const templateData = [
            ['STT', 'Mã sinh viên', 'Họ và tên đệm', 'Tên', 'Mã lớp', 'Số điện thoại', 'Email', 'Vai trò'],
            ['1', 'SV001', 'Nguyễn Văn', 'A', 'CNTT1', '0123456789', 'sv001@example.com', 'student'],
            ['2', 'SV002', 'Trần Thị', 'B', 'CNTT1', '0987654321', 'sv002@example.com', 'student']
        ]

        // Convert to CSV format for download
        const csvContent = templateData.map(row => row.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'template_import_sinh_vien.csv')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <Page>
            <div className="import-container">
                <div className="header-section">
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate("/admin")}
                        className="back-button"
                    >
                        ← Quay lại
                    </Button>
                    <h1 className="title">IMPORT SINH VIÊN TỪ EXCEL</h1>
                </div>
                
                {/* File Upload Section */}
                <div className="upload-section">
                    <div className="file-input-container">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                            className="file-input"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="file-label">
                            <div className="upload-icon">📁</div>
                            <div className="upload-text">
                                <Text bold>Chọn file Excel</Text>
                                <Text size="small" className="upload-hint">
                                    Hoặc kéo thả file vào đây
                                </Text>
                            </div>
                        </label>
                    </div>

                    {selectedFile && (
                        <div className="file-info">
                            <div className="file-details">
                                <Text bold>📄 {selectedFile.name}</Text>
                                <Text size="small" className="file-size">
                                    Kích thước: {formatFileSize(selectedFile.size)}
                                </Text>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className="error-message">
                        <Text className="error-text">❌ {error}</Text>
                    </div>
                )}

                {/* Import Result */}
                {importResult && (
                    <div className="result-section">
                        <h3 className="result-title">Kết quả import:</h3>
                        <div className="result-stats">
                            <div className="stat-item success">
                                <Text bold>✅ Thành công: {importResult.imported}</Text>
                            </div>
                            <div className="stat-item error">
                                <Text bold>❌ Thất bại: {importResult.failed}</Text>
                            </div>
                        </div>

                        {importResult.errors && importResult.errors.length > 0 && (
                            <div className="error-list">
                                <Text bold className="error-list-title">
                                    Chi tiết lỗi:
                                </Text>
                                <div className="error-items">
                                    {importResult.errors.map((error, index) => (
                                        <div key={index} className="error-item">
                                            <Text size="small">• {error}</Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {importResult.users && importResult.users.length > 0 && (
                            <div className="success-list">
                                <Text bold className="success-list-title">
                                    Danh sách sinh viên đã import:
                                </Text>
                                <div className="user-items">
                                    {importResult.users.map((user, index) => (
                                        <div key={index} className="user-item">
                                            <Text size="small">
                                                • {user.fullName} ({user.userId}) - {user.email}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <Button 
                        variant="secondary" 
                        onClick={downloadTemplate}
                        className="btn-template"
                    >
                        📥 Tải template Excel
                    </Button>
                    
                    <Button 
                        variant="primary" 
                        onClick={handleImport}
                        disabled={!selectedFile || loading}
                        className="btn-import"
                    >
                        {loading ? "🔄 Đang import..." : "📤 Import sinh viên"}
                    </Button>
                </div>

                {/* Instructions */}
                <div className="instructions">
                    <h3 className="instructions-title">📋 Hướng dẫn sử dụng:</h3>
                    <div className="instruction-steps">
                        <div className="step">
                            <Text bold>1. Tải template Excel</Text>
                            <Text size="small">Nhấn nút "Tải template Excel" để tải file mẫu</Text>
                        </div>
                        <div className="step">
                            <Text bold>2. Điền thông tin sinh viên</Text>
                            <Text size="small">Điền thông tin sinh viên theo định dạng trong template</Text>
                        </div>
                        <div className="step">
                            <Text bold>3. Upload file</Text>
                            <Text size="small">Chọn file Excel đã điền thông tin và nhấn "Import sinh viên"</Text>
                        </div>
                    </div>

                    <div className="format-info">
                        <Text bold>📊 Định dạng file Excel:</Text>
                        <div className="format-table">
                            <div className="format-row">
                                <Text size="small" bold>Cột A:</Text>
                                <Text size="small">STT (số thứ tự)</Text>
                            </div>
                            <div className="format-row">
                                <Text size="small" bold>Cột B:</Text>
                                <Text size="small">Mã sinh viên</Text>
                            </div>
                            <div className="format-row">
                                <Text size="small" bold>Cột C:</Text>
                                <Text size="small">Họ và tên đệm</Text>
                            </div>
                            <div className="format-row">
                                <Text size="small" bold>Cột D:</Text>
                                <Text size="small">Tên</Text>
                            </div>
                            <div className="format-row">
                                <Text size="small" bold>Cột E:</Text>
                                <Text size="small">Mã lớp</Text>
                            </div>
                            <div className="format-row">
                                <Text size="small" bold>Cột F:</Text>
                                <Text size="small">Số điện thoại</Text>
                            </div>
                            <div className="format-row">
                                <Text size="small" bold>Cột G:</Text>
                                <Text size="small">Email</Text>
                            </div>
                            <div className="format-row">
                                <Text size="small" bold>Cột H:</Text>
                                <Text size="small">Vai trò (student)</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    )
}

export default ImportStudents 