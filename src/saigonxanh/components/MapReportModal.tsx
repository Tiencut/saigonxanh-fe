import React from 'react';
import { X, MapPin, CheckCircle } from 'lucide-react';
import type { useEnvironmentalMap } from './useEnvironmentalMap';

export function MapReportModal({ mapState }: { mapState: ReturnType<typeof useEnvironmentalMap> }) {
  const {
    showReportModal,
    setShowReportModal,
    reportLat,
    reportLon,
    reportAddress,
    setReportAddress,
    reverseLoading,
    reportForm,
    setReportForm,
    submitSuccessCode,
    setSubmitSuccessCode,
    handleSubmitReport,
  } = mapState;
  return (
    <>
      {/* MODAL: BÁO ĐIỂM RÁC */}
      {showReportModal && (
        <div className="report-modal-overlay">
          <div className="report-modal-card">
            <div className="report-modal-header">
              <h3>Báo Điểm Rác Ô Nhiễm</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => {
                  setShowReportModal(false);
                  setSubmitSuccessCode(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            {submitSuccessCode ? (
              <div className="report-success-box">
                <CheckCircle size={48} color="#16a34a" />
                <h4>Gửi phản ánh thành công!</h4>
                <p>
                  Mã tra cứu của bạn là: <strong>{submitSuccessCode}</strong>
                </p>
                <p className="text-sm text-muted">
                  Ban điều phối Sài Gòn Xanh sẽ tiến hành xác minh và hiển thị điểm rác trên bản đồ
                  công khai trong vòng 24h.
                </p>
                <button
                  type="button"
                  className="btn-submit-report"
                  onClick={() => {
                    setShowReportModal(false);
                    setSubmitSuccessCode(null);
                  }}
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="report-form-body">
                <p className="report-required-note">
                  <span className="report-required-mark" aria-hidden="true">
                    *
                  </span>{' '}
                  Bắt buộc. Họ tên và số điện thoại là tùy chọn.
                </p>
                {/* Location indicator */}
                <div className="form-location-box">
                  <div className="location-box-head">
                    <MapPin size={16} color="#dc2626" />
                    <span className="font-bold text-sm">Vị trí phản ánh <span className="report-required-mark" aria-hidden="true">*</span></span>
                    {reverseLoading && <span className="text-xs text-muted">Đang định vị...</span>}
                  </div>
                  <p className="text-xs text-muted">
                    {reportLat && reportLon
                      ? `Tọa độ: ${reportLat.toFixed(5)}, ${reportLon.toFixed(5)}`
                      : 'Chưa chọn vị trí. Nhấn lên bản đồ để đặt ghim.'}
                  </p>
                  <label htmlFor="map-report-address">Địa chỉ cụ thể <span className="report-required-mark" aria-hidden="true">*</span></label>
                  <input
                    id="map-report-address"
                    minLength={5}
                    type="text"
                    required
                    placeholder="Địa chỉ cụ thể (tự động điền hoặc sửa tay)..."
                    value={reportAddress}
                    onChange={(e) => setReportAddress(e.target.value)}
                    className="report-input-text"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="map-report-title">Tiêu đề phản ánh <span className="report-required-mark" aria-hidden="true">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Bãi rác tự phát chân cầu..."
                    minLength={3}
                    id="map-report-title"
                    value={reportForm.title}
                    onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                    className="report-input-text"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="map-report-waste">Loại rác thải <span className="report-required-mark" aria-hidden="true">*</span></label>
                    <select
                      required
                      id="map-report-waste"
                      value={reportForm.wasteType}
                      onChange={(e) => setReportForm({ ...reportForm, wasteType: e.target.value })}
                      className="report-select"
                    >
                      <option value="Rác sinh hoạt & túi nilon">Rác sinh hoạt & túi nilon</option>
                      <option value="Rác thải nhựa, phao xốp">Rác thải nhựa, phao xốp</option>
                      <option value="Xà bần & phế thải xây dựng">Xà bần & phế thải xây dựng</option>
                      <option value="Rác cồng kềnh (nệm, bàn ghế)">
                        Rác cồng kềnh (nệm, bàn ghế)
                      </option>
                      <option value="Rác nguy hại (pin, ắc quy, dầu)">
                        Rác nguy hại (pin, ắc quy, dầu)
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="map-report-severity">Mức độ nghiêm trọng <span className="report-required-mark" aria-hidden="true">*</span></label>
                    <select
                      required
                      id="map-report-severity"
                      value={reportForm.severity}
                      onChange={(e) =>
                        setReportForm({
                          ...reportForm,
                          severity: e.target.value as any,
                        })
                      }
                      className="report-select"
                    >
                      <option value="LOW">Ít (Có thể gom nhanh)</option>
                      <option value="MEDIUM">Trung bình (Ứ đọng cục bộ)</option>
                      <option value="HIGH">Nặng (Tắc nghẽn dòng chảy)</option>
                      <option value="CRITICAL">Báo động (Ô nhiễm nghiêm trọng)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="map-report-description">Mô tả chi tiết hiện trạng <span className="report-required-mark" aria-hidden="true">*</span></label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Mô tả bờ kè, độ sâu, độ ô nhiễm, lối tiếp cận cho xe thu gom..."
                    minLength={5}
                    id="map-report-description"
                    value={reportForm.description}
                    onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                    className="report-textarea"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="map-reporter-name">Họ tên người báo (tùy chọn)</label>
                    <input
                      type="text"
                      placeholder="Người dân địa phương"
                      id="map-reporter-name"
                      value={reportForm.reporterName}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, reporterName: e.target.value })
                      }
                      className="report-input-text"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="map-reporter-phone">Số điện thoại (tùy chọn, bảo mật)</label>
                    <input
                      type="tel"
                      placeholder="09xx..."
                      id="map-reporter-phone"
                      value={reportForm.reporterPhone}
                      onChange={(e) =>
                        setReportForm({ ...reportForm, reporterPhone: e.target.value })
                      }
                      className="report-input-text"
                    />
                  </div>
                </div>

                <div className="modal-form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowReportModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-submit-report">
                    Gửi Phản Ánh
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
