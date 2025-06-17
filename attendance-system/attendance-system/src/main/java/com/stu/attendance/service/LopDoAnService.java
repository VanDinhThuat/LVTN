package com.stu.attendance.service;

import com.stu.attendance.dto.LopDoAnDTO;
import com.stu.attendance.entity.LopDoAn;
import com.stu.attendance.repository.LopDoAnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LopDoAnService {
    
    private final LopDoAnRepository lopDoAnRepository;

    @Transactional
    public LopDoAnDTO addLopDoAn(LopDoAnDTO lopDoAnDTO) {
        // Validate thời gian
        if (lopDoAnDTO.getThoiGianKetThuc() != null && 
            lopDoAnDTO.getThoiGianBatDau() != null && 
            lopDoAnDTO.getThoiGianKetThuc().isBefore(lopDoAnDTO.getThoiGianBatDau())) {
            throw new RuntimeException("Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        LopDoAn lopDoAn = new LopDoAn();
        lopDoAn.setTenLopDoAn(lopDoAnDTO.getTenLopDoAn());
        String maThamGia = UUID.randomUUID().toString().replace("-", "").substring(0, 10); // 10 ký tự
        lopDoAn.setMaThamGia(maThamGia);
        lopDoAn.setGhiChu(lopDoAnDTO.getGhiChu());
        lopDoAn.setGvId(lopDoAnDTO.getGvId());
        lopDoAn.setThoiGianBatDau(lopDoAnDTO.getThoiGianBatDau());
        lopDoAn.setThoiGianKetThuc(lopDoAnDTO.getThoiGianKetThuc());
        LopDoAn savedLopDoAn = lopDoAnRepository.save(lopDoAn);
        
        return convertToDTO(savedLopDoAn);
    }

    @Transactional
    public void deleteLopDoAn(Integer maLopDoAn) {
        if (!lopDoAnRepository.existsByMaLopDoAn(maLopDoAn)) {
            throw new RuntimeException("Không tìm thấy lớp đồ án với mã " + maLopDoAn);
        }
        lopDoAnRepository.deleteById(maLopDoAn);
    }

    private LopDoAnDTO convertToDTO(LopDoAn lopDoAn) {
        return new LopDoAnDTO(
            lopDoAn.getMaLopDoAn(),
            lopDoAn.getTenLopDoAn(),
            lopDoAn.getMaThamGia(),
            lopDoAn.getGhiChu(),
            lopDoAn.getGvId(),
            lopDoAn.getThoiGianBatDau(),
            lopDoAn.getThoiGianKetThuc()
        );
    }

    public List<LopDoAnDTO> getLopDoAnByGvId(String gvId) {
        List<LopDoAn> lopDoAnList = lopDoAnRepository.findByGvId(gvId);
        List<LopDoAnDTO> lopDoAnDTOs = new ArrayList<>();
        for (LopDoAn lopDoAn : lopDoAnList) {
            LopDoAnDTO dto = new LopDoAnDTO(
                lopDoAn.getMaLopDoAn(),
                lopDoAn.getTenLopDoAn(),
                lopDoAn.getMaThamGia(),
                lopDoAn.getGhiChu(),
                lopDoAn.getGvId(),
                lopDoAn.getThoiGianBatDau(),
                lopDoAn.getThoiGianKetThuc()
            );
            lopDoAnDTOs.add(dto);
        }
        return lopDoAnDTOs;
    }

    public LopDoAnDTO getLopDoAnByMaLopDoAn(Integer maLopDoAn) {
        LopDoAn lopDoAn = lopDoAnRepository.findById(maLopDoAn)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp đồ án với mã " + maLopDoAn));
        return convertToDTO(lopDoAn);
    }

} 