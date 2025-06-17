package com.stu.attendance.service;

import com.stu.attendance.dto.TuanNopBaiDTO;
import com.stu.attendance.entity.NhomDoAn;
import com.stu.attendance.entity.TuanNopBai;
import com.stu.attendance.repository.NhomDoAnRepository;
import com.stu.attendance.repository.TuanNopBaiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TuanNopBaiService {

    private final TuanNopBaiRepository tuanNopBaiRepository;
    private final NhomDoAnRepository nhomDoAnRepository;

    public List<TuanNopBaiDTO> getWeeksByNhomDoan(Integer maNhomDoan) {
        List<TuanNopBai> weeks = tuanNopBaiRepository.findByNhomDoAn_MaNhomOrderByNgayBatDauAsc(maNhomDoan);
        return weeks.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<TuanNopBaiDTO> getActiveWeeks() {
        List<TuanNopBai> weeks = tuanNopBaiRepository.findCurrentActiveWeeks();
        return weeks.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public TuanNopBaiDTO createWeek(TuanNopBaiDTO dto) {
        NhomDoAn nhomDoAn = nhomDoAnRepository.findById(dto.getMaNhomDoan())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm đồ án"));

        TuanNopBai tuanNopBai = new TuanNopBai();
        tuanNopBai.setNhomDoAn(nhomDoAn);
        tuanNopBai.setTenTuan(dto.getTenTuan());
        tuanNopBai.setMoTa(dto.getMoTa());
        tuanNopBai.setNgayBatDau(dto.getNgayBatDau());
        tuanNopBai.setNgayKetThuc(dto.getNgayKetThuc());
        tuanNopBai.setTrangThai(dto.getTrangThai() != null ? dto.getTrangThai() : "active");

        TuanNopBai saved = tuanNopBaiRepository.save(tuanNopBai);
        return convertToDTO(saved);
    }

    @Transactional
    public TuanNopBaiDTO updateWeek(Integer maTuan, TuanNopBaiDTO dto) {
        TuanNopBai tuanNopBai = tuanNopBaiRepository.findById(maTuan)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuần nộp bài"));

        tuanNopBai.setTenTuan(dto.getTenTuan());
        tuanNopBai.setMoTa(dto.getMoTa());
        tuanNopBai.setNgayBatDau(dto.getNgayBatDau());
        tuanNopBai.setNgayKetThuc(dto.getNgayKetThuc());
        tuanNopBai.setTrangThai(dto.getTrangThai());

        TuanNopBai saved = tuanNopBaiRepository.save(tuanNopBai);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteWeek(Integer maTuan) {
        tuanNopBaiRepository.deleteById(maTuan);
    }

    @Transactional
    public void closeWeek(Integer maTuan) {
        TuanNopBai tuanNopBai = tuanNopBaiRepository.findById(maTuan)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuần nộp bài"));
        tuanNopBai.setTrangThai("closed");
        tuanNopBaiRepository.save(tuanNopBai);
    }

    private TuanNopBaiDTO convertToDTO(TuanNopBai entity) {
        TuanNopBaiDTO dto = new TuanNopBaiDTO();
        dto.setMaTuan(entity.getMaTuan());
        dto.setMaNhomDoan(entity.getNhomDoAn().getMaNhom());
        dto.setTenTuan(entity.getTenTuan());
        dto.setMoTa(entity.getMoTa());
        dto.setNgayBatDau(entity.getNgayBatDau());
        dto.setNgayKetThuc(entity.getNgayKetThuc());
        dto.setTrangThai(entity.getTrangThai());
        dto.setSoLuongNopBai(entity.getNopBais() != null ? (long) entity.getNopBais().size() : 0L);
        dto.setDaQuaHan(LocalDate.now().isAfter(entity.getNgayKetThuc()));
        return dto;
    }
}